class CreateFacts < ActiveRecord::Migration
  def change
    create_table :facts do |t|
      t.references :user, index: true, foreign_key: true
      t.string :project_name
      t.string :fact_text

      t.timestamps null: false
    end
  end
end
