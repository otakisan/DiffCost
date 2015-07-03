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
				thisController.pageTitle = "見積・実績比較";
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
				
					// 実績比較表取得のためのデータを取得
					//var postData = thisController.getPostData();
				
					// 登録
					//$http.post(postData.url, postData.params)
					thisController.waiting = true;
					var project_name_encoded = encodeURIComponent(thisController.selectedProject);
					$http.get("/cost_comparisons/" + project_name_encoded + ".json")
						.success(function (data, status, headers, config) {
						thisController.pageTitle = "取得完了：" + thisController.selectedProject;
						thisController.costComparisonResult = data;
						thisController.waiting = false;
						if (data.quotations.length > 0) {
							thisController.quotationsTerm.start = data.quotations[0].updated_at;
							thisController.quotationsTerm.end = data.quotations[data.quotations.length - 1].updated_at;
						}
					})
						.error(function (data, status, headers, config) {
						thisController.pageTitle = "取得失敗";
						thisController.costComparisonResult = data;
						thisController.waiting = false;
					});
				};
				
				this.refreshCostComparisonTable = function() {
					
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
				
					// 登録
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