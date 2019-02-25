import through from 'through2'

export function bufferify(factory) {
	return through.obj(function(file, endcoding, callback) {
		if(file.isNull()) {
			return callback(null, file)
		}

		if(file.isStream()) {
			console.error('streaming not supported in gulp-bufferify.')
			return callback()
		}

		if(typeof factory !== 'function') {
			console.error('factory should be a function in gulp-bufferify.')
			return callback(null, file)
		}

		var content = file.contents
		var length = factory.length

		if(length >= 4) {
			return factory(content, file, this, callback)
		}

		var result = factory(content, file, this) || content
		file.contents = new Buffer(result)
		return callback(null, file)
	})
}
export default bufferify
