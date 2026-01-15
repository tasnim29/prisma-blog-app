import { Request, Response } from "express";

export function notFound(req:Request,res:Response){
    res.status(400).json({
        message:"Route not found",
        path:req.originalUrl,
        date:Date()
    })
}