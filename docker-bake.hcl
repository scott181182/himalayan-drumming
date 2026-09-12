target "docker-metadata-action-frontend" {}
target "docker-metadata-action-migrate" {}

target "base" {
  context = "."
  platforms = [ "linux/amd64" ]
}

target "frontend" {
  inherits = [ "base", "docker-metadata-action-frontend" ]
  target = "frontend"
}
target "migrate" {
  inherits = [ "base", "docker-metadata-action-migrate" ]
  target = "migrate"
}

group "default" {
  targets = [ "frontend", "migrate" ]
}
