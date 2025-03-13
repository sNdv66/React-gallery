#ifndef CORS_H
#define CORS_H

#include "crow.h"

struct CORS {
    struct context {};

    void before_handle(crow::request& req, crow::response& res, context&) {
        // Pastikan semua response memiliki header CORS
        res.set_header("Access-Control-Allow-Origin", "*");
        res.set_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.set_header("Access-Control-Allow-Headers", "Content-Type, Authorization");

        // Jika request OPTIONS (Preflight request), langsung kirim respons kosong dengan status 204
        if (req.method == crow::HTTPMethod::OPTIONS) {
            res.code = 204;
            res.end();
        }
    }

    void after_handle(crow::request& req, crow::response& res, context&) {
        // Tambahkan lagi jika diperlukan setelah request diproses
        res.set_header("Access-Control-Allow-Origin", "*");
        res.set_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.set_header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    }
};

#endif // CORS_H