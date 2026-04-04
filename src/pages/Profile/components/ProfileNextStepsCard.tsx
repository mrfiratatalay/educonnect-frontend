import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProfileNextStepsCardProps {
  isOwnProfile: boolean;
}

export default function ProfileNextStepsCard({
  isOwnProfile,
}: ProfileNextStepsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Bu Taskta Neler Aktif?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Bu ekranda profil bilgileri artik gercek backend verisinden geliyor.
          Gonderiler, gruplar ve sosyal baglanti bolumleri bir sonraki taskta
          gercek veriye baglanacak.
        </p>

        <div className="flex flex-wrap gap-3">
          {isOwnProfile && (
            <Link to="/settings">
              <Button size="sm">Profil Bilgilerini Duzenle</Button>
            </Link>
          )}

          <Link to="/feed">
            <Button size="sm" variant="outline">
              Feed'e Git
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
