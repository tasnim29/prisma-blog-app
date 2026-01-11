type IOptions = {
    limit?:number | string
    page?:number | string
    sortBy?:string
    sortOrder?:string
}

type IOptionsResult = {
    page:number,
    limit:number,
    skip:number,
    sortBy:string,
    sortOrder:string

}

const paginationSortingHelper =(options:IOptions):IOptionsResult=>{
    // console.log("params are: ",options)

    const page = Number(options.page) || 1
    const limit = Number(options.limit) || 5
    const skip = (page - 1) * limit

    const sortBy:string = options.sortBy || "createdAt"
    const sortOrder = options.sortOrder || "desc"

    return {
        page,
        limit,
        skip,
        sortBy,
        sortOrder
    }
    // console.log(typeof page)


}

export default paginationSortingHelper