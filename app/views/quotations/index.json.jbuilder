json.array!(@quotations) do |quotation|
  json.extract! quotation, :id, :user_id, :project_name, :quotation_text
  json.url quotation_url(quotation, format: :json)
end
