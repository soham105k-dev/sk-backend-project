class ApiError extends error {
    constructor(
        statusCode,
        message="something went wrong",
        errors=[],
        stacks=""
    ){
        super()
        this.statusCode=statusCode
        this.data=null,
        this.message=message
        this.success=false
        this.errors=errors

        if(stacks){
            this.stacks=stacks
        }
        else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export {ApiError}