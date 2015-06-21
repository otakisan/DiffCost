class CreateQuotations < ActiveRecord::Migration
  def change
    create_table :quotations do |t|
      t.references :user, index: true, foreign_key: true
      t.string :project_name
      t.string :quotation_text

      t.timestamps null: false
    end
  end
end
