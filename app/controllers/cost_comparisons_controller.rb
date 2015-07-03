class CostComparisonsController < ApplicationController

  def show
    #@quotations = Quotation.where('project_name = ?', cost_comparison_params[:project_name])
    #@facts = Fact.where('project_name = ?', cost_comparison_params[:project_name])
    @quotations = Quotation.where('project_name = ?', params[:project_name])
    @facts = Fact.where('project_name = ?', params[:project_name])
  end

  def download
    @quotations = Quotation.where('project_name = ?', params[:project_name]).order('updated_at')
    @facts = Fact.where('project_name = ?', params[:project_name]).order('updated_at')

    respond_to do |format|
      format.html { redirect_to :action => 'download', :format => 'csv' } # .csv がなくアクセスした場合はリダイレクト
      #format.csv { render :content_type => 'text/csv' }
      format.csv { send_data render_to_string, filename: "cost-comparisons-#{Time.now.to_date.to_s}.csv", type: :csv }
    end
  end

  private

    # Web APIのみで、チェック不要のため使用しない
    # Never trust parameters from the scary internet, only allow the white list through.
    def cost_comparison_params
      #params.permit(:project_name)
    end

end
