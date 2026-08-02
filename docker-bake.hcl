target "docker-metadata-action-frontend" {}
target "docker-metadata-action-migrate" {}

target "base" {
  context = "."
  platforms = [ "linux/amd64" ]
}

target "frontend" {
  inherits = [ "base", "docker-metadata-action-frontend" ]
  target = "frontend"
  tags = [
    "ghcr.io/scott181182/himalayan-drumming:latest",
  ]
}
target "migrate" {
  inherits = [ "base", "docker-metadata-action-migrate" ]
  target = "migrate"
  tags = [
    "ghcr.io/scott181182/himalayan-drumming/db-migrate:latest",
  ]
}

group "default" {
  targets = [ "frontend", "migrate" ]
}
