import { prisma } from "../../db/prisma";
import { ApiError } from "../../utils/apiError";
import { comparePassword, hashPassword } from "../../utils/password";
import { signToken } from "../../utils/jwt";
import { LoginInput, RegisterInput } from "./auth.schema";

function toPublicUser(user: {
  id: number;
  email: string;
  name: string | null;
  role: string;
}) {
  return { id: user.id, email: user.email, name: user.name, role: user.role };
}

export async function register(input: RegisterInput) {
  const existing = await prisma.user.findUnique({
    where: { email: input.email },
  });
  if (existing) {
    throw new ApiError(409, "Email already in use");
  }

  const passwordHash = await hashPassword(input.password);
  const user = await prisma.user.create({
    data: {
      email: input.email,
      passwordHash,
      name: input.name,
      role: "USER",
    },
  });

  console.log("user:", user);

  const accessToken = signToken({ id: user.id, role: user.role });
  return { accessToken, user: toPublicUser(user) };
}

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const valid = await comparePassword(input.password, user.passwordHash);
  if (!valid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const accessToken = signToken({ id: user.id, role: user.role });
  return { accessToken, user: toPublicUser(user) };
}

export async function getCurrentUser(id: number) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return toPublicUser(user);
}
