export interface AppGroup {
  id: string;
  name: string;
  description: string;
  category: string;
  creatorUserId: string;
  creatorName: string;
  memberCount: number;
  isMember: boolean;
  createdAt: string;
}

export interface CreateGroupInput {
  name: string;
  description: string;
  category: string;
}
