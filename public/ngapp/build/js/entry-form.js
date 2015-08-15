'use strict';

(function () {
	angular.module('entryFormApp', []).directive('entryForm', function () {
		// templateUrlは、ディレクティブを呼び出しているページからの相対パス
		// ルートからの相対パスにして、どこからでも使えるようにする
		return {
			restrict: 'E',
			templateUrl: '/ngapp/partials/entry-form.html',
			controller: ['$http', function ($http) {
				// ケアレスミスを防ぐため、最初にthisを移し替えることをルールとしたほうがいいのかも
				var thisController = this;

				// ユーザーをひも付ける情報は、railsのidとアプリのidとどちらがよいか
				// データベースの移行を考えると、連番よりも固有のアカウントIDのほうがよさそうに感じる
				// API越しに関連付ける際、デフォルトのUser.idではなく、User.user_idとひも付ける
				thisController.appTitle = "見積・実績";
				thisController.pageTitle = "入力ページ(兼トップページ)";
				thisController.userText = "";
				thisController.userTableId = 0;
				thisController.userId = "";
				thisController.entityTargets = [{
					'name': '見積',
					'value': 'quotation'
				}, {
					'name': '実績',
					'value': 'fact'
				}];
				thisController.entityTarget = thisController.entityTargets[0].value;

				// 通信がからむときの実行順が気になる。ここに限らずだけど。
				// TODO: ユーザー固定の仕様だが、特定ユーザーを検索する形にし、存在しなければ登録できないようにするか
				$http.get('/users/1.json').success(function (data) {
					thisController.userTableId = data.id;
					thisController.userId = data.user_id;
				});

				// プロパティもメソッドも全部定義するから、中身が膨れやすい
				this.submitForm = function () {
					thisController.pageTitle = "登録中... : " + thisController.userText;

					// 選択したエンティティ向けのパラメータを作成
					var postData = thisController.getPostData();

					// 登録
					$http.post(postData.url, postData.params).success(function (data, status, headers, config) {
						thisController.pageTitle = "登録完了 ID：" + data.id;
						thisController.userText = "";
					}).error(function (data, status, headers, config) {
						thisController.pageTitle = "登録失敗";
					});
				};

				this.getPostData = function () {
					return {
						'url': '/' + thisController.entityTarget + 's.json',
						'params': thisController.getPostParams()
					};
				};

				this.getPostParams = function () {
					var textPropName = thisController.entityTarget + '_text';
					var projectNameAndText = thisController.splitProjectNameAndText();
					var postParam = {
						'project_name': projectNameAndText.project_name,
						'user_id': thisController.userTableId,
						'man_day': projectNameAndText.man_day
					};
					postParam[textPropName] = projectNameAndText.text;

					return postParam;
				};

				this.splitProjectNameAndText = function () {
					// Javascriptでは、後読みがサポートされていない
					// #始まりはプロジェクト案件名、空白で区切って、以降は全て内容とする
					var re = /(^#.+?(?=\s+))?(.+)/g;
					var matchArray = re.exec(thisController.userText.trim());

					var manDay = "";
					var text = matchArray[2].trim();
					var manDayMatch = /\b([0-9][0-9\.]*)(?=人日)/g.exec(matchArray[2]);
					if (manDayMatch) {
						manDay = manDayMatch[1];
						var regex = new RegExp('\\b' + manDay + '人日');
						text = matchArray[2].replace(regex, "").trim();
					}

					// よりシンプルな形で#を取り除く方法ってどんなものか
					return {
						'text': text,
						'project_name': /^#(.*)/g.exec(matchArray[1] || '#')[1],
						'man_day': manDay
					};
				};
			}],
			controllerAs: 'diffCost'
		};
	});
})();
//# sourceMappingURL=entry-form.js.map