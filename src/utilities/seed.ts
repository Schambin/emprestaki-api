import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seedAdminUser() {
    try {
        const adminEmail = 'admin@library.com';

        const existingAdmin = await prisma.user.findUnique({
            where: { email: adminEmail }
        });

        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash('admin123', 10);

            await prisma.user.create({
                data: {
                    name: 'Admin',
                    email: adminEmail,
                    password: hashedPassword,
                    role: 'ADMINISTRADOR'
                }
            });
            console.log('📗 Admin user created');
        } else {
            console.log('📘 Admin user already exists');
        }


        const readerEmail = 'reader@library.com';
        const existingReader = await prisma.user.findUnique({
            where: { email: readerEmail }
        });

        if (!existingReader) {
            const hashedPassword = await bcrypt.hash('reader123', 10);

            await prisma.user.create({
                data: {
                    name: 'Reader',
                    email: readerEmail,
                    password: hashedPassword,
                    role: 'LEITOR'
                }
            });
            console.log('📗 Reader user created');
        } else {
            console.log('📘 Reader user already exists');
        }


    } catch (error) {
        console.error('Error seeding admin user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

export default seedAdminUser;