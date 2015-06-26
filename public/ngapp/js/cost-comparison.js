(function () {
	angular.module('costComparisonApp', [])
		.directive('costComparisonForm', function () {
		// templateUrlは、ディレクティブを呼び出しているページからの相対パス
		// ルートからの相対パスにして、どこからでも使えるようにする
		return {
			restrict: 'E',
			templateUrl: '/ngapp/partials/cost-comparison.html',
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
			
				// プロジェクトの種類を取得
				$http.get('/quotations/projectindex.json').success(function (data) {
					thisController.projects = data;
					thisController.selectedProject = thisController.projects[0].project_name;
				});
			
				// プロパティもメソッドも全部定義するから、中身が膨れやすい
				this.submitForm = function () {
					thisController.pageTitle = "取得中... : ";
				
					// 実績比較表取得のためのデータを取得
					var postData = thisController.getPostData();
				
					// 登録
					$http.post(postData.url, postData.params)
						.success(function (data, status, headers, config) {
						thisController.pageTitle = "取得完了 ID：" + thisController.selectedProject;
						thisController.costComparisonResult = data;
					})
						.error(function (data, status, headers, config) {
						thisController.pageTitle = "取得失敗";
						thisController.costComparisonResult = data;
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
				
				this.postRequestCsv = function () {
					thisController.pageTitle = "CSV取得中... : ";
				
					// 実績比較表取得のためのデータを取得
					var postData = thisController.getPostData();
				
					// 登録
					// TODO:どういうリクエストを送ればいい？
					$http.post('/cost-comparisons/csvdata', postData.params)
						.success(function (data, status, headers, config) {
						thisController.pageTitle = "登録完了 ID：" + data.id;
						thisController.userText = "";
					})
						.error(function (data, status, headers, config) {
						thisController.pageTitle = "登録失敗";
					});
				};
			}],
			controllerAs: 'costComparison'
		};
	});
})();