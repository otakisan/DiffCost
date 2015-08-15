class AddColumnToFacts < ActiveRecord::Migration
  def change
    add_column :facts, :man_day, :float
  end
end
