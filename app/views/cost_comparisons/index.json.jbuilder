json.array!(@cost_comparisons) do |cost_comparison|
  json.extract! cost_comparison, :id
  json.url cost_comparison_url(cost_comparison, format: :json)
end
