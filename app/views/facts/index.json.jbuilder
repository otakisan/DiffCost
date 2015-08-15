json.array!(@facts) do |fact|
  json.extract! fact, :id, :user_id, :project_name, :fact_tex, :man_day
  json.url fact_url(fact, format: :json)
end
