import { NextFunction, Request, Response } from "express"
import { Prisma } from "../../generated/prisma/client"

function errorHandler (err:any, req:Request, res:Response, next:NextFunction) {
 
    let statusCode = 500;
    let errorMessage="Internal server error";
    let errorDetails = err

    if(err instanceof Prisma.PrismaClientValidationError){
        statusCode = 400;
        errorMessage = "Incorrect fields or missing fields"
    }
    else if(err instanceof Prisma.PrismaClientKnownRequestError){
        if(err.code==="P2025"){
            statusCode = 400;
            errorMessage = "The record you want to do operation is not present"
        }
        else if(err.code="P202"){
             statusCode = 400;
            errorMessage = "Duplicate key error"
        }
    }

    else if(err instanceof Prisma.PrismaClientUnknownRequestError){
        statusCode = 500;
        errorMessage = "Error occurred during query execution"
    }
  res.status(statusCode)
  res.json({
    message:errorMessage,
    error:errorDetails
  })
}
export default errorHandler