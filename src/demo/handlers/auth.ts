import { newId, saveDb } from "@/demo/db";
import { noContent, ok, problem, route, text } from "@/demo/http";
import { findUser, toUserProfile } from "@/demo/mappers";
import { nowIso } from "@/demo/time";
import type { DemoDb, DemoUser } from "@/demo/types";

const CODE_TTL_MS = 10 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;

const invalid = (detail: string) => problem(400, "Invalid Operation", detail);

export async function sha256(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

/** The access token only names the user; the demo checks it against the stored session. */
function issueSession(db: DemoDb, user: DemoUser) {
  return {
    accessToken: `demo.${user.id}.${Math.random().toString(36).slice(2)}`,
    expiresAtUtc: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    user: toUserProfile(db, user),
  };
}

function issueChallenge(user: DemoUser) {
  const code = String(Math.floor(Math.random() * 1_000_000)).padStart(6, "0");
  const now = Date.now();
  user.verification = {
    code,
    expiresAtUtc: new Date(now + CODE_TTL_MS).toISOString(),
    sentAtUtc: new Date(now).toISOString(),
    attempts: 0,
  };
  saveDb();
  return {
    email: user.email,
    verificationExpiresAtUtc: user.verification.expiresAtUtc,
    canResendAtUtc: new Date(now + RESEND_COOLDOWN_MS).toISOString(),
    message: `Demo modunda e-posta gönderilmez. Doğrulama kodun: ${code}`,
  };
}

route("POST", "/api/auth/login", async ({ db, body }) => {
  const email = text(body.email).toLocaleLowerCase("tr-TR");
  const user = db.users.find((item) => item.email === email && item.isActive);
  if (!user || (await sha256(String(body.password ?? ""))) !== user.passwordHash) {
    return problem(401, "Unauthorized", "E-posta veya şifre hatalı.");
  }
  if (!user.emailVerified) {
    return invalid("Kurumsal e-posta doğrulaması tamamlanmadı.");
  }
  db.sessionUserId = user.id;
  saveDb();
  return ok(issueSession(db, user));
}, { anonymous: true });

// The real API reads an HttpOnly refresh cookie; the demo keeps the session in localStorage.
route("POST", "/api/auth/refresh", ({ db }) => {
  const user = db.sessionUserId ? findUser(db, db.sessionUserId) : undefined;
  return user ? ok(issueSession(db, user)) : problem(401, "Unauthorized", "Oturum yenilenemedi.");
}, { anonymous: true });

route("POST", "/api/auth/logout", ({ db }) => {
  db.sessionUserId = null;
  saveDb();
  return noContent();
}, { anonymous: true });

route("GET", "/api/universities", ({ db }) =>
  ok(db.universities.map(({ id, name, city, domain }) => ({ id, name, city, domain }))),
{ anonymous: true });

route("POST", "/api/auth/register", async ({ db, body }) => {
  const fullName = text(body.fullName);
  const department = text(body.department);
  const email = text(body.email).toLocaleLowerCase("tr-TR");
  const university = db.universities.find((item) => item.id === text(body.universityId));
  if (!university) return invalid("Kayıt için üniversite seçmelisin.");
  if (!fullName) return invalid("Ad soyad zorunludur.");
  if (!department) return invalid("Bölüm zorunludur.");

  const domain = email.split("@")[1] ?? "";
  if (domain !== university.domain && !domain.endsWith(`.${university.domain}`)) {
    return invalid("Kayıt için seçilen üniversiteye ait kurumsal e-posta adresi kullanılmalıdır.");
  }

  let user = db.users.find((item) => item.email === email);
  if (user?.emailVerified) return invalid("Bu e-posta adresi zaten kayıtlı.");

  const passwordHash = await sha256(String(body.password ?? ""));
  const year = Math.min(Math.max(Number(body.year) || 1, 1), 4);
  if (user) {
    Object.assign(user, { fullName, department, year, passwordHash, universityId: university.id });
  } else {
    user = {
      id: newId("u"), fullName, email, passwordHash, role: "student", universityId: university.id,
      department, year, isActive: true, emailVerified: false, createdAtUtc: nowIso(),
    };
    db.users.push(user);
  }
  return ok(issueChallenge(user));
}, { anonymous: true });

route("POST", "/api/auth/verify-email", ({ db, body }) => {
  const email = text(body.email).toLocaleLowerCase("tr-TR");
  const user = db.users.find((item) => item.email === email);
  const verified = ok({ message: "Kurumsal e-posta adresin doğrulandı. Artık giriş yapabilirsin." });
  if (!user) return invalid("Doğrulama bekleyen hesap bulunamadı.");
  if (user.emailVerified) return verified;

  const challenge = user.verification;
  if (!challenge) return invalid("Aktif bir doğrulama kodu bulunamadı.");
  if (Date.parse(challenge.expiresAtUtc) <= Date.now()) return invalid("Doğrulama kodunun süresi doldu.");

  challenge.attempts += 1;
  saveDb();
  if (challenge.attempts > 5) return invalid("Çok fazla hatalı deneme yaptın. Yeni bir kod iste.");
  if (text(body.code) !== challenge.code) return invalid("Doğrulama kodu hatalı.");

  user.emailVerified = true;
  delete user.verification;
  saveDb();
  return verified;
}, { anonymous: true });

route("POST", "/api/auth/resend-verification", ({ db, body }) => {
  const email = text(body.email).toLocaleLowerCase("tr-TR");
  const user = db.users.find((item) => item.email === email);
  if (!user) return invalid("Doğrulama bekleyen hesap bulunamadı.");
  if (user.emailVerified) return invalid("Bu hesap zaten doğrulandı.");
  if (user.verification) {
    const waitMs = Date.parse(user.verification.sentAtUtc) + RESEND_COOLDOWN_MS - Date.now();
    if (waitMs > 0) return invalid(`Yeni kod istemek için ${Math.ceil(waitMs / 1000)} saniye bekle.`);
  }
  return ok(issueChallenge(user));
}, { anonymous: true });

route("POST", "/api/auth/forgot-password", () =>
  ok({ message: "Eğer kullanıcı mevcutsa şifre sıfırlama işlemi başlatılmıştır." }),
{ anonymous: true });
