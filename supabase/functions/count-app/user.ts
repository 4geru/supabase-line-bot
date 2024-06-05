import { supabaseClient } from './supabaseClient'

export class User {
    _supabase = supabaseClient()
    userId
    info
    constructor({userId}: {userId: string}) {
        this.userId = userId
        this.info = {}
    }
    load = async() => {
        const { data: users, error } = await this._supabase
            .from('users')
            .select()
            .eq('user_id', this.userId)

        if (users.length !== 0) {
            this.info = users[0]
            return users[0]
        } else {
            const { data: users, error } = await this._supabase
                .from('users')
                .insert({ user_id: this.userId, status: { count: 0 }})
            this.info = users[0]
            return users[0]
        }
    }
    updateStatus = async(status: JSON) => {
        const { data: user, error } = await this._supabase.from('users')
            .update({ status: status })
            .eq('user_id', this.userId)
        this.info = {
            ...this.info,
            status: status
        }
    }
}