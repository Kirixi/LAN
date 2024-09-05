output "zone_id" {
  value       = aws_route53_zone.subdomain.zone_id
  description = "The ID of the hosted zone"
}

output "name_servers" {
  value       = aws_route53_zone.subdomain.name_servers
  description = "A list of name servers in the hosted zone"
}
