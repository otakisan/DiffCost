json.set! :quotations do
  json.array!(@quotations) do |quotation|
    json.extract! quotation, :id, :user_id, :project_name, :quotation_text, :man_day, :created_at, :updated_at
    json.url quotation_url(quotation, format: :json)
  end
end
json.set! :facts do
  json.array!(@facts) do |fact|
    json.extract! fact, :id, :user_id, :project_name, :fact_text, :man_day, :created_at, :updated_at
    json.url fact_url(fact, format: :json)
  end
end

