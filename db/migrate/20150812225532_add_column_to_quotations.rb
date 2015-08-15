class AddColumnToQuotations < ActiveRecord::Migration
  def change
    add_column :quotations, :man_day, :float
  end
end
