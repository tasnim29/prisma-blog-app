import { prisma } from "../lib/prisma"
import { userRole } from "../middlewares/auth"

async function seedAdmin (){
    try {

        console.log("****process started*****")

        const adminData = {
            name:"Mr X",
            email:"x@gmail.com",
            role:userRole.ADMIN,
            password:"admin123"
        }


        const existingUser = await prisma.user.findUnique({
            where:{
                email:adminData.email
            }
        })



        if(existingUser){
            throw new Error("Already exists")
        }

        const signUpAdmin = await fetch("http://localhost:3000/api/auth/sign-up/email",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(adminData)
        })

         console.log("****admin created*****")

        
        if(signUpAdmin.ok){
            await prisma.user.update({
                where:{
                    email:adminData?.email
                },
                data:{
                    emailVerified:true
                }
            })
        }

             console.log("****admins data updated*****")


    } catch (error) {
        console.log("Error is: ",error)
    }
}

seedAdmin()