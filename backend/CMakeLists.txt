cmake_minimum_required(VERSION 3.14)
project(server)

# Include directories
include_directories(${CMAKE_SOURCE_DIR}/include)

include_directories(/data/data/com.termux/files/home/libs/asio/include)

include_directories($ENV{HOME}/libs/boost)

find_package(Boost REQUIRED COMPONENTS filesystem)
include_directories(${Boost_INCLUDE_DIRS})

# Find SQLite3
find_package(SQLite3 REQUIRED)
find_library(SQLite3_LIBRARY sqlite3
             PATHS /data/data/com.termux/files/usr/lib
                   $ENV{PREFIX}/lib)

if(NOT SQLite3_INCLUDE_DIR OR NOT SQLite3_LIBRARY)
    message(FATAL_ERROR "SQLite3 library not found!")
endif()

include_directories(${SQLite3_INCLUDE_DIR})

# Compiler flags
set(CMAKE_CXX_FLAGS "-O2 -march=native -pipe")

# Source files
set(SOURCES
    main.cpp
)

# Create executable
add_executable(server ${SOURCES})

# Link libraries
target_link_libraries(server PRIVATE SQLite::SQLite3)
target_link_libraries(server PRIVATE Boost::filesystem)

target_precompile_headers(server PRIVATE lib/precompiled.h)
add_library(project_pch INTERFACE)
target_precompile_headers(project_pch INTERFACE lib/precompiled.h)
target_link_libraries(server PRIVATE project_pch)

set(CMAKE_UNITY_BUILD ON)