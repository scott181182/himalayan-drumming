target "base" {
    context = "."
    platforms = [
        "linux/amd64",
        "linux/arm64"
    ]
}

target "frontend" {
    inherits = [ "base" ]
    target = "frontend"
}

target "backend" {
    inherits = [ "base" ]
    target = "backend"
}