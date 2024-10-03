variable "bucket_name" {
  description = "Name of the bucket"
  type        = string
}

variable "bucket_tag" {
  description = "Tag of the bucket"
  type        = string
}

variable "versioning" {
  description = "Versioning status, [Enabled, Disabled, Suspended]"
  type        = string
}
