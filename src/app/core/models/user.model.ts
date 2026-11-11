export interface User {
  id: number; name: string; email: string; weight: number;
  height: number; age: number; gender: 'male' | 'female';
  isProfileComplete: boolean;
}