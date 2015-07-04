require 'csv' # config/application.rb に書いてもいいらしい
require 'nkf'

csv_str = CSV.generate do |csv|
  # I18n で CSV のカラム名を取得
  # キー側はリテラルで指定しても構わない
  cols = {
    Quotation.human_attribute_name(:project_name)  => ->(q, f){ q.nil? ? "" : q.project_name },
    Quotation.human_attribute_name(:quotation_text)  => ->(q, f){ q.nil? ? "" : q.quotation_text },
    Quotation.human_attribute_name(:updated_at)  => ->(q, f){ q.nil? ? "" : q.updated_at.localtime.to_s.gsub(/ \+[0-9]{4}/, "") },
    Fact.human_attribute_name(:project_name)  => ->(q, f){ f.nil? ? "" : f.project_name },
    Fact.human_attribute_name(:fact_text)  => ->(q, f){ f.nil? ? "" : f.fact_text },
    Fact.human_attribute_name(:updated_at)  => ->(q, f){ f.nil? ? "" : f.updated_at.localtime.to_s.gsub(/ \+[0-9]{4}/, "") }
  }

  # header の追加
  csv << cols.keys

  # body の追加
  loop_count = [@quotations.count, @facts.count].max
  loop_count.times do |loop_index|
    csv << cols.map{|k, col| col.call(@quotations.at(loop_index), @facts.at(loop_index)) }
  end

end

# 文字コード変換
NKF::nkf('--sjis -Lw', csv_str)
