module.exports = {
    development: {
        client: 'mysql',
        connection: {
            user: 'root',
            database: 'deployment',
        },
        migrations: {
            directory: __dirname + '/db/migrations'
        },
        seeds: {
            directory: __dirname + '/db/seeds'
        }
    }
} 