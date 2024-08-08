import { PrismaClient } from "@prisma/client";

// 싱글톤 패턴을 사용하여 PrismaClient 인스턴스 생성
const prismaClientSingleton = () => {
    return new PrismaClient()
  }
  
  // PrismaClientSingleton 타입 정의
  declare global {
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>
  }
  
  const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma;