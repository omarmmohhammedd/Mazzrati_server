exports.errorHandle = (error,req,res,next)=>{
    return res.status(error.statusCode).json({
        status: error.status,
        error: error,
        message: error.message,
        stack: error.stack,
    });
}