json.array!(@users) do |user|
  json.extract! user, :id, :user_id, :password
  json.url user_url(user, format: :json)
end
