export interface CreditDetail {
    canceled: boolean,
    studio: string,
    studio_id: number,
    lesson_type: string,
    lesson_type_id: number
    expires_at: Date,
    paused:  boolean,
    validity: number,
    amount: number 
}