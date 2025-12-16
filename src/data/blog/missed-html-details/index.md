---
title: "Missed HTML: details"
date: 2021-12-13
tags: ["html"]
excerpt: "The details tag is often overlooked and reinvented."
short: "HTML: details"
---

## &lt;details&gt;

> The &lt;details&gt; HTML element creates a disclosure widget in which information is visible only when the widget is toggled into an "open" state. A summary or label must be provided using the &lt;summary&gt; element. - [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details)

### HTML

```html
<details>
  <summary>Detail</summary>
  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
</details>
<details>
  <summary>Detail2</summary>
  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
</details>
```

<div class="bg-white border border-gray-200 mt-6 p-4 ">
<details class="block">
    <summary class="text-black">Detail</summary>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
</details>
<details class="block">
    <summary class="text-black">Detail2</summary>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
</details>
</div>

### And with a little css and nesting.

```html
<style>
  details.css summary:hover,
  details.css li:hover {
    color: blue;
  }
  details.css {
    cursor: pointer;
  }
  details.css > details {
    margin-left: 12px;
  }
  details.css > details > details {
    margin-left: 24px;
  }
  details.css ul {
    margin: 0;
  }
</style>

<details class="css">
  <summary>Root</summary>
  <details>
    <summary>Dir</summary>
    <details>
      <summary>file list</summary>
      <ul>
        <li>a</li>
        <li>b</li>
        <li>c</li>
      </ul>
    </details>
  </details>
</details>
```

<style>
	details.css summary:hover, details.css li:hover {
		color: blue;
	}
	details.css {
		cursor: pointer;
	}
	details.css > details {
		margin-left: 12px;
	}
	details.css > details > details {
		margin-left: 24px;
	}
	details.css ul {
		margin: 0;
	}
</style>
<div class="bg-white border border-gray-200 mt-6 p-4 text-black"">
	<details class="css">
		<summary class="text-black">Root</summary>
		<details>
			<summary class="text-black">Dir</summary>
			<details>
			<summary class="text-black">file list</summary>
			<ul class="text-black">
				<li>a</li>
				<li>b</li>
				<li>c</li>
			</ul>
		</details>
		</details>
	</details>
</div>
