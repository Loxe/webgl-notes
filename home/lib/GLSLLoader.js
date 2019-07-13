
// GLSL 文件加载 
var GLSLLoader = function () {

	// 加载单个着色器文件
	this.load = function (url) {

		return new Promise(function (resolve, reject) {

			loader(url, function (response) {

				resolve(response);

			}, function (error) {

				reject(error)

			})

		})

	}

	this.loadArray = function (arrays, onload, onError) {

		if (!(arrays instanceof Array)) {
			console.warn('variable is not Array');
		}

		var results = [];

		arrays.forEach(values => {

			var name_end = values.indexOf('.glsl');

			var name = values.substring(0, name_end);

			scope.load(values).then(data => {

				// 以对象的形式返回着色器代码
				results.push({
					name:name,
					shader:data
				});

				if (results.length === arrays.length) {
					onload(results);			
				}

			})

		})

	}

	// 加载两个着色器文件
	this.loadAll = function (urls, onLoad, onError) {

		var shader = {};

		if ((typeof urls) == 'string') {

			urls = [urls];

		}

		urls.forEach(values => {

			scope.load(values).then(function (data) {

				var fragment = data.includes('gl_FragColor');

				if (fragment) {
					shader.fragment = data;
				} else {
					shader.vertex = data;
				}

				if (shader.vertex && shader.fragment) onLoad(shader);

			}, function (error) {

				onError(error)

			})

		});

	}

	var scope = this;

	function loader(url, onLoad, onError) {

		if (!url) console.warn('url is error or is undefined...');

		var xhr = new XMLHttpRequest();

		xhr.open('GET', url, true);

		xhr.addEventListener('load', function (event) {

			var responseText = this.responseText;

			if (this.status !== 200) {

				onError(event);

			} else {

				// 通过正则表达式去掉注释
				responseText = responseText.replace(/(\n)|(\/{2,}.*?(\r|\n))|(\/\*(\n|.)*?\*\/)/g, '');

				onLoad(responseText);

			}

		}, false);

		xhr.addEventListener('error', function (event) {

			onError(event);

		}, false);

		xhr.send(null);

	}

}