(function () {
	angular.module('costComparisonFormApp', [])
		.directive('costComparisonForm', function () {
		// templateUrlは、ディレクティブを呼び出しているページからの相対パス
		// ルートからの相対パスにして、どこからでも使えるようにする
		return {
			restrict: 'E',
			templateUrl: '/ngapp/partials/cost-comparison-form.html',
			controller: ['$http', function ($http) {
				// ケアレスミスを防ぐため、最初にthisを移し替えることをルールとしたほうがいいのかも
				var thisController = this;
			
				// ユーザーをひも付ける情報は、railsのidとアプリのidとどちらがよいか
				// データベースの移行を考えると、連番よりも固有のアカウントIDのほうがよさそうに感じる
				// API越しに関連付ける際、デフォルトのUser.idではなく、User.user_idとひも付ける
				thisController.pageTitleDefault = "見積・実績比較";
				thisController.pageTitle = thisController.pageTitleDefault;
				thisController.projects = [];
				thisController.costComparisonResult = {};
				thisController.userId = "";
				thisController.waiting = false;
				thisController.csvUrl = "";
				thisController.quotationsTerm = {start: "", end: ""};
			
				// プロジェクトの種類を取得
				$http.get('/quotations/projects/index.json').success(function (data) {
					thisController.projects = data;
					thisController.selectedProject = thisController.projects[0].project_name;
					thisController.changedSelectedProject();
				});
			
				// プロパティもメソッドも全部定義するから、中身が膨れやすい
				this.submitForm = function () {
					thisController.pageTitle = "取得中... : ";

					// データを取得
					thisController.waiting = true;
					var project_name_encoded = encodeURIComponent(thisController.selectedProject);
					$http.get("/cost_comparisons/" + project_name_encoded + ".json")
						.success(function (data, status, headers, config) {
						// タイトルを元に戻し、データを保持
						thisController.pageTitle = thisController.pageTitleDefault;
						thisController.costComparisonResult = data;
						thisController.waiting = false;
					})
						.error(function (data, status, headers, config) {
						thisController.pageTitle = "取得失敗";
						thisController.costComparisonResult = data;
						thisController.waiting = false;
					});
				};

				// TODO: 画面のラベルに表示する文字列はコントローラーの責務でないように思えるが、一旦実装する
				this.getQuotationTermText = function() {
					return this.getTermText(this.costComparisonResult.quotations);
				};

				this.getFactTermText = function() {
					return this.getTermText(this.costComparisonResult.facts);
				};

				this.getTermText = function(dataArray) {
					var quotationTermText = "";
					if (dataArray && dataArray.length > 0) {
						quotationTermText = new Date(dataArray[0].updated_at).toLocaleString() + " 〜 "
						+ new Date(dataArray[dataArray.length - 1].updated_at).toLocaleString();
					}
					
					return quotationTermText;
				};

				this.getProjectNameText = function() {
					var dataArray = this.costComparisonResult.quotations || this.costComparisonResult.facts;
					return dataArray && dataArray.length > 0 ? dataArray[0].project_name : "";
				};

				this.getPostData = function () {
					return {
						'url': '/cost-comparisons.json',
						'params': thisController.getPostParams()
					};
				};

				this.getPostParams = function () {
					var postParam = {
						'project_name': thisController.selectedProject,
						'user_id': thisController.userTableId
					};

					return postParam;
				};
				
				this.downloadCsv = function () {
					thisController.pageTitle = "CSV取得中... : ";
				
					// 実績比較表取得のためのデータを取得
					//var postData = thisController.getPostData();
				
					// 取得
					// TODO:どういうリクエストを送ればいい？
					thisController.waiting = true;
					var project_name_encoded = encodeURIComponent(thisController.selectedProject);
					$http.get("/cost_comparisons/download/" + project_name_encoded + ".csv")
						.success(function (data, status, headers, config) {
						thisController.pageTitle = "取得完了";
						thisController.waiting = false;
					})
						.error(function (data, status, headers, config) {
						thisController.pageTitle = "取得失敗";
						thisController.waiting = false;
					});
				};
				
				this.changedSelectedProject = function () {
					var project_name_encoded = encodeURIComponent(thisController.selectedProject);
					thisController.csvUrl = "/cost_comparisons/download/" + project_name_encoded + ".csv";
				};
			}],
			controllerAs: 'costComparison'
		};
	});
})();