#include <iostream>
#include <vector>
#include <sqlite3.h>
#include <string>



class Database {
private:
    sqlite3* db;

public:
    Database(const std::string& db_name) {
        int rc = sqlite3_open(db_name.c_str(), &db);
        if (rc) {
            std::cerr << "Cannot open database: " << sqlite3_errmsg(db) << std::endl;
            sqlite3_close(db);
            throw std::runtime_error("Database connection failed");
        }

        const char* create_table = 
            "CREATE TABLE IF NOT EXISTS users ("
            "id INTEGER PRIMARY KEY AUTOINCREMENT,"
            "username TEXT NOT NULL UNIQUE,"
            "password TEXT NOT NULL,"
            "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
            ");";

        char* err = nullptr;
        rc = sqlite3_exec(db, create_table, nullptr, nullptr, &err);

        if (rc != SQLITE_OK) {
            std::cerr << "SQL error: " << err << std::endl;
            sqlite3_free(err);
            sqlite3_close(db);
            throw std::runtime_error("Table creation failed");
        }
    }

    ~Database() {
        if (db) {
            sqlite3_close(db);
        }
    }
    
    bool isvalid() const {
      return db != nullptr;
    };
};