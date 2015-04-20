# -*- coding: utf-8 -*-
<%inherit file="layout.mako"/>

<h1>Login</h1>




<form class="form-horizontal" action="${url}" method="post">
    <input type="hidden" name="came_from" value="${came_from}"/>
    <div class="form-group">
        <label for="inputUser" class="col-sm-2 control-label">User</label>
        <div class="col-sm-10">
            <input type="text" class="form-control" id="inputLogin" value="${login}" name="login" placeholder="Login" autofocus>
        </div>
  </div>
  <div class="form-group">
    <label for="inputPassword" class="col-sm-2 control-label">Password</label>
    <div class="col-sm-10">
      <input type="password" class="form-control" id="inputPassword" value="${password}" name="password" placeholder="Password">
    </div>
  </div>
  <div class="form-group">
    <div class="col-sm-offset-2 col-sm-10">
      <div class="checkbox">
        <label>
          <input type="checkbox"> Remember me
        </label>
      </div>
    </div>
  </div>
  <div class="form-group">
    <div class="col-sm-offset-2 col-sm-10 col-xs-12 btn-group">
      <input type="submit" name="form.submitted" class="btn btn-default col-xs-12" value="Log in!" />
    </div>
  </div>
</form>


