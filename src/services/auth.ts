import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export class AuthService {
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  generateToken(userId: string, role: "host" | "attendee"): string {
    return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "1h" });
  }

  verifyToken(token: string): any {
    return jwt.verify(token, JWT_SECRET);
  }
}
