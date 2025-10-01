export interface ApiInterface<T = any> {
    success: boolean
    messsage: string // Sesuai dengan typo pada backend
    data: T
}