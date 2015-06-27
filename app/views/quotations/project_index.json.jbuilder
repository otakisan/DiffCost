json.array!(@quotations_projects) do |quotations_project|
  json.extract! quotations_project, :project_name
  #json.url quotation_url(quotation, format: :json)
end
