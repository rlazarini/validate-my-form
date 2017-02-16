# [Validate my form](https://www.npmjs.com/package/validate-my-form)

A form validator to validate input[required] fields;

## Using Validate my form you can:
  - Validate a form;
  - Using default validation rules;
  - Create your own validation rules;

### Installation
###### Using like a library
```sh
$ git clone https://github.com/rlazarini/validate-my-form.git
```
```HTML
<body>
...
...
<script src="path/to/validate-my-form/index.js"></script>
</body>
```

###### Using like a module
```sh
$ npm install validate-my-form --save
```

### Usage
###### Using like a module
```js
var validateMyForm = require('validate-my-form');
validateMyForm._validateMyForm(form);
```

#### Examples
###### Basic Usage
```html
<body>
	<form action="" id="form" novalidate>
		<input type="text">
		<!-- Validate only required fields -->
		<input type="text" required="required">
		<input type="email" required="required">
		<input type="number" required="required">
		<input type="password" required="required">
		<input type="submit" value="send">
	</form>
	<script>
		var form = document.getElementById('form');

		form.onsubmit = function(e) {
			e.preventDefault();
			validateMyForm._validateMyForm(form);
		}
	</script>
</body>
``` 

###### Create and validating a new type
```html
<body>
	<form action="" id="form" novalidate>
		<input type="textwiththreespaces" required="required">
		<input type="submit" value="send">
	</form>
	<script>
		var form = document.getElementById('form')
		,	obj  = {
			'textwiththreespaces': /\w+\s{3}\w+/g
		};
		
		form.onsubmit = function(e) {
			e.preventDefault();
			validateMyForm._validateMyForm(form,obj);
		}
	</script>
</body>
``` 

###### Send a validate using attribute data-type
> In this method, the input don't lose your properties. data-type="name" validate input[text] with rule text{space}text. You can create your own data-type and pass a object to validate then.

```html
<body>
	<form action="" id="form" novalidate>
		<input type="text" data-type="name" required="required">
		<input type="text" data-type="myowndatatype" required="required">
		<input type="submit" value="send">
	</form>
	<script>
		var form = document.getElementById('form')
		,	obj  = {
			'myowndatatype': /^\d{2}[.]\d{3}[-]\d{3}[\/]\d{3}[-]\d{2}$/g
			// validate something like: 00.000-000/000-00
		}
		form.onsubmit = function(e) {
			e.preventDefault();
			validateMyForm._validateMyForm(form,obj);
		}
	</script>
</body>
``` 
> Default Options to data-type

```sh
	- number  	## Validate a field with only numbers
	- cpf		## Validate a Brazil document
	- phone		## Validate a Brazilian phone number
	- zipcode	## Validate a Brazilian zipcode address
	- currency	## Validate a monetary value. By default, using R$, but you can pass a monetary symbol with attribute data-monetary (see more above)
	- name		## Validate a name, basically, they need two block of words: Like John Doe
```