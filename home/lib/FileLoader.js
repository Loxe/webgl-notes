(function () {

	function FileLoader() { }

	Object.assign(FileLoader.prototype, {

		load: function (url, onLoad, onError) {

			if (url === undefined) url = '';

			var request = new XMLHttpRequest();

			request.open('GET', url, true);

			request.addEventListener('load', function (event) {

				var responseText = this.responseText;

				if (this.status === 200 || this.status === 0) {

					if (this.status === 0) console.warn('HTTP 状态码 0');

					// 通过正则表达式去掉注释
					responseText = responseText.replace(/(\n)|(\/{2,}.*?(\r|\n))|(\/\*(\n|.)*?\*\/)/g, '');

					onLoad(responseText);

				} else {

					request.onerror = function (event) {

						onError(event)

					}

				}

			})

			request.send(null);

		}

	})

	window.FileLoader = FileLoader;

})()