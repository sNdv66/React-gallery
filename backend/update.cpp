#include "lib/precompiled.h" //  include crow
#include <boost/filesystem.hpp>
#include "middle.cpp"
#include <fstream>
#include <ctime>
#include <iomanip>
#include <sstream>

using namespace std;
namespace fs = boost::filesystem;


// global variable
const string upload_folder = "uploads/";

// function directory
void ensure_directory() {
    if (!fs::exists(upload_folder)) {
        fs::create_directory(upload_folder);
    }
}


int main() {
    app.loglevel(crow::LogLevel::Info);
    crow::SimpleApp app;

// setup middlecors

    

// ≈=========================================.
// api DELETE image
    CROW_ROUTE(app, "/api/image/<string>").methods(crow::HTTPMethod::DELETE)
   ([](string filename) {
       string filepath = upload_folder + filename;
       
       if (!fs::exists(filepath)) {
           return crow::response(404, "File tidak ditemukan");
       }
       
       try {
           fs::remove(filepath);
           return crow::response(200, "{\"message\": \"Gambar berhasil dihapus\"}");
       } catch (const std::exception& e) {
           return crow::response(500, "{\"error\": \"Gagal menghapus gambar\"}");
       }
   });

//==============================================
// ubah nama gambar 


CROW_ROUTE(app, "/api/image/rename").methods(crow::HTTPMethod::PUT)
   ([](const crow::request& req) {
       auto x = crow::json::load(req.body);
       if (!x) {
           return crow::response(400, "JSON tidak valid");
       }
       
       string old_name = x["old_name"].s();
       string new_name = x["new_name"].s();
       
       if (old_name.empty() || new_name.empty()) {
           return crow::response(400, "Nama file lama dan baru harus disediakan");
       }
       
       string old_path = upload_folder + old_name;
       string new_path = upload_folder + new_name;
       
       if (!fs::exists(old_path)) {
           return crow::response(404, "File tidak ditemukan");
       }
       
       if (fs::exists(new_path)) {
           return crow::response(409, "File dengan nama tersebut sudah ada");
       }
       
       try {
           fs::rename(old_path, new_path);
           return crow::response(200, "{\"message\": \"Nama file berhasil diubah\"}");
       } catch (const std::exception& e) {
           return crow::response(500, "{\"error\": \"Gagal mengubah nama file\"}");
       }
   });
   
   //=======================================

    //cek create_directory
    ensure_directory();
//============================================
      //api menampilkan gambar
      

    CROW_ROUTE(app, "/api/images/")
	    ([]() {
	         CROW_LOG_INFO << "Mengambil daftar gambar dari " << upload_folder;

		     std::vector<std::string> files;
		         for (const auto &entry : fs::directory_iterator(upload_folder)) {
			         if (fs::is_regular_file(entry.path())) {
				             files.push_back(entry.path().filename().string());
					             }
						         }

							     if (files.empty()) {
							             return crow::response(404, "Tidak ada gambar yang ditemukan.");
								         }

									     crow::json::wvalue json_res;
									         json_res["images"] = files;
										     return crow::response{json_res};
										     });
    
    

//===================≠===≈=====================

// api upload gambar 
    CROW_ROUTE(app, "/api/upload").methods(crow::HTTPMethod::POST)
    ([](const crow::request& req) {
        CROW_LOG_INFO << "Menerima request upload.";

        auto headers = req.get_header_value("Content-Type");
        if (headers.find("multipart/form-data") == std::string::npos) {
            return crow::response(400, "Format multipart tidak valid.");
        }

        size_t boundaryPos = headers.find("boundary=");
        if (boundaryPos == std::string::npos) {
            return crow::response(400, "Boundary tidak ditemukan.");
        }

        std::string boundary = "--" + headers.substr(boundaryPos + 9);
        std::string body = req.body;
        size_t fileStart = body.find("\r\n\r\n");
        if (fileStart == std::string::npos) {
            return crow::response(400, "Format multipart tidak valid.");
        }

        fileStart += 4;  
        size_t fileEnd = body.find(boundary, fileStart);
        if (fileEnd == std::string::npos) {
            return crow::response(400, "Tidak dapat menemukan akhir file.");
        }

        // Buat nama file unik dengan timestamp
        auto t = std::time(nullptr);
        std::ostringstream oss;
        oss << std::put_time(std::localtime(&t), "%Y%m%d%H%M%S");
        std::string filename = upload_folder + oss.str() + ".jpg";

        // Simpan file
        std::ofstream file(filename, std::ios::binary);
        file.write(body.data() + fileStart, fileEnd - fileStart - 4);
        file.close();

        CROW_LOG_INFO << "File berhasil disimpan di " << filename;
        return crow::response(200, "{\"message\": \"Upload berhasil!\", \"filename\": \"" + filename + "\"}");
    });
  
// ======================================================
// api menampilkan spesifik image


    CROW_ROUTE(app, "/api/image/<string>").methods(crow::HTTPMethod::GET)
    ([](const crow::request& req, crow::response& res, string filename) {
        string filepath = upload_folder + filename;

        CROW_LOG_INFO << "mengirim gambar ..: " << filepath;

        if (!fs::exists(filepath)) {
            res.code = 404;
            res.body = "File tidak ditemukan";
            res.end();
            return;
        }

        ifstream file(filepath, ios::binary);
        stringstream buffer;
        buffer << file.rdbuf();
        res.set_header("Content-Type", "image/jpeg");
        res.body = buffer.str();
        res.code = 200;
        res.end();
    });
// ==================================
   
   
    
    // port 

    app.bindaddr("0.0.0.0").port(8080).multithreaded().run();
}
