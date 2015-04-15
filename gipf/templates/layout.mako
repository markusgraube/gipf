<!DOCTYPE html>
<html lang="${request.locale_name}" xmlns="http://www.w3.org/1999/html" xmlns="http://www.w3.org/1999/html">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Gipf game">
    <meta name="author" content="Markus Graube">
    <link rel="shortcut icon" href="${request.static_url('gipf:static/pyramid-16x16.png')}">

    <title><%block name="title">Gipf</%block></title>

    <!-- Bootstrap core CSS -->
    <link href="${request.static_url('gipf:static/css/bootstrap.min.css')}" rel="stylesheet">
    <link href="${request.static_url('gipf:static/css/font-awesome.css')}" rel="stylesheet">

    <!-- Custom styles for this scaffold -->
    <link href="${request.static_url('gipf:static/css/theme.css')}" rel="stylesheet">

    <!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
      <script src="//oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
      <script src="//oss.maxcdn.com/libs/respond.js/1.3.0/respond.min.js"></script>
    <![endif]-->
    <%block name="header"/>
  </head>

  <body>
    <nav class="navbar navbar-default navbar-static-top" role="navigation">
        <div class="container">
            <div class="navbar-header">
                <a class="navbar-brand" href="/">Gipf Online</a>
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
            </div>

            <div id="navbar" class="collapse navbar-collapse">
              <ul class="nav navbar-nav navbar-left">
                <li><a href="/game"><i class="fa fa-trophy"></i> Game List</a></li>
                <li><a href="/settings"><i class="fa fa-cogs"></i> Settings</a></li>
              </ul>
              <ul class="nav navbar-nav navbar-right">
                <li><a href="/docs"><i class="fa fa-book"></i> Docs</a></li>
                <li><a href="https://github.com/Pylons/pyramid"><i class="fa fa-github"></i> Github Project</a></li>
                <li><a href="http://www.gipf.com/"><i class="fa fa-home"></i> Gipf Website</a></li>
                <li class="divider"></li>
                <li><a href="/login"><i class="fa fa-user"></i> Login</a></li>
              </ul>
            </div>
        </div>
    </nav>

       <div class="container">

        ${next.body()}

        <div class="row">
          <div class="copyright">
            Copyright &copy; Markus Graube
          </div>
        </div>
      </div>


    <!-- Bootstrap core JavaScript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    <script src="${request.static_url('gipf:static/js/jquery-2.1.3.min.js')}"></script>
    <script src="${request.static_url('gipf:static/js/bootstrap.min.js')}"></script>
    <%block name="scripts"/>
  </body>
</html>
