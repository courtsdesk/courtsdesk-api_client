$(document).ready(function() {
  var access_token = null;

  $('form.login-form').on('submit', function(e) {
    e.preventDefault();

    var $form = $(this);
    var url = $form.attr('action');

    $.ajax({
      type: 'POST',
      url: url,
      data: $form.serialize(),
      success: function(data) {
        access_token = data['access_token'];
        $('.page').toggleClass('d-none')
      },
      error: function(data, _status, xhr) {
        var message = 'Something went wrong. Please check your application id and secret.';
        add_error_message(message);
      }
    });
  });

  $('form.search-form').on('submit', function(e) {
    e.preventDefault();

    var url = $(this).attr('action');
    search(url);
  });

  $('body').on('click', 'a.prev, a.next', function(e) {
    e.preventDefault();

    var url = $(this).attr('href');

    if (url != 'null') {
      search(url);
      $(window).scrollTop(0);
    }
  });

  $('body').on('click', '.results .title a', function(e) {
    e.preventDefault();
    $('.details').empty();
    $('.results-container').addClass('d-none');
    $('.details-container').removeClass('d-none');
    var url = $(this).attr('href');
    get_details(url)
  });

  $('body').on('click', '.details-container .back', function(e) {
    e.preventDefault();

    $('.details-container').addClass('d-none');
    $('.results-container').removeClass('d-none');
  });

  function add_details(data) {
    var attributes = data['data']['attributes'];
    var $container = $('.details-container .details');
    var $row = $(`
      <div class='info-row row'>
        <div class='col-sm-8'>
          <h5 class='title'>${attributes['title']}</h5>
        </div>

        <div class='col-sm-2'>
          <h5 class='reference'>${attributes['reference']}</h5>
        </div>

        <div class='col-sm-2'>
          <h5 class='date'>${attributes['issued_on']}</h5>
        </div>
      </div>

      <div class='info-row row'>
        <div class='col-sm-12'>
          <h2>Case Details</h2>
        </div>
      </div>

      <div class='row'>
        <div class='col-sm-5'>
          <h5>Set Down Number:</h5>
        </div>

        <div class='col-sm-7'>
          <span class="indented">${attributes['set_down']['number']}</span>
        </div>
      </div>

      <div class='row'>
        <div class='col-sm-5'>
          <h5>Set Down On:</h5>
        </div>

        <div class='col-sm-7'>
          <span class="indented">${attributes['set_down']['on']}</span>
        </div>
      </div>

      <div class='row'>
        <div class='col-sm-5'>
          <h5>Circuit Court Appeals:</h5>
        </div>

        <div class='col-sm-7'>
          <span class="indented">${attributes['circuit_court_appeals']}</span>
        </div>
      </div>

      <div class='row'>
        <div class='col-sm-5'>
          <h5>Supreme Court Appeals:</h5>
        </div>

        <div class='col-sm-7'>
          <span class="indented">${attributes['supreme_court_appeals']}</span>
        </div>
      </div>

      <div class='info-row row'>
        <div class='col-sm-5'>
          <h2>Defendants:</h2>
        </div>

        <div class='col-sm-7'>
          <ul>
            ${$.map(attributes['defendants'], function(defendant) {
              return `<li>${defendant.name}</li>`;
            }).join('')}
          </ul>
        </div>
      </div>

      <div class='info-row row'>
        <div class='col-sm-5'>
          <h2>Legal Representation (defendants):</h2>
        </div>

        <div class='col-sm-7'>
          <ul>
            ${$.map(attributes['defendants'], function(defendant) {
              return `<li>${defendant.solicitor}</li>`;
            }).join('')}
          </ul>
        </div>
      </div>

      <div class='info-row row'>
        <div class='col-sm-5'>
          <h2>Plaintiffs:</h2>
        </div>

        <div class='col-sm-7'>
          <ul>
            ${$.map(attributes['plaintiffs'], function(plaintiff) {
              return `<li>${plaintiff.name}</li>`;
            }).join('')}
          </ul>
        </div>
      </div>

      <div class='info-row row'>
        <div class='col-sm-5'>
          <h2>Legal Representation (plaintiffs):</h2>
        </div>

        <div class='col-sm-7'>
          <ul>
            ${$.map(attributes['plaintiffs'], function(plaintiff) {
              return `<li>${plaintiff.solicitor}</li>`;
            }).join('')}
          </ul>
        </div>
      </div>

      <div class='info-row row'>
        <div class='col-sm-12'>
          <h2>Judgments:</h2>
          <table class="table table-striped">
            ${$.map(attributes['judgments'], function(judgment) {
              return `<tr>
                        <td>${judgment['delivered_on']}</td>
                        <td>${judgment['distributed_on']}</td>
                        <td>${judgment['judge']}</td>
                      </tr>`
            }).join('')}
          </table>
        </div>
      </div>

      <div class='info-row row'>
        <div class='col-sm-12'>
          <h2>Listings:</h2>
          <table class="table table-striped">
            ${$.map(attributes['listings'], function(listing) {
              return `<tr>
                        <td>${listing['created_on']}</td>
                        <td>${listing['list']}</td>
                        <td>${listing['note']}</td>
                        <td>${listing['position']}</td>
                        <td>${listing['result']}</td>
                      </tr>`
            }).join('')}
          </table>
        </div>
      </div>

      <div class='info-row row'>
        <div class='col-sm-12'>
          <h2>Orders:</h2>
          <table class="table table-striped">
            ${$.map(attributes['orders'], function(order) {
              return `<tr>
                        <td>${order['collected']}</td>
                        <td>${order['created_on']}</td>
                        <td>${order['index']}</td>
                        <td>${order['perfected_on']}</td>
                        <td>${order['registrar']}</td>
                        <td>${order['result']}</td>
                      </tr>`
            }).join('')}
          </table>
        </div>
      </div>
      </div>
    `);

    $container.html($row);
  };

  function add_error_message(message) {
    var $container = $('#error');
    var $row = $(`
      <div class='row'>
        <div class='col-sm-12'>
          <p>${message}</p>
        </div>
      </div>
    `);

    $container.html($row);
  };

  function add_meta(data) {
    var $container = $('.results-container .meta');

    var $row = $(`
      <div class='row'>
        <div class='col-sm-12'>
          <p>Displaying page ${data['meta']['page']} of ${data['meta']['count']} results</p>
        </div>
      </div>
    `);

    $container.html($row);
  };

  function add_pagination(data) {
    var $container = $('.results-container .pagination');
    var $row = $(`
      <div class='row'>
        <div class='col-sm-12'>
          <a class='prev' href="${data['links']['prev']}">Previous</a> <a class='next' href="${data['links']['next']}">Next</a>
        </div>
      </div>
    `);

    $container.html($row);
  };

  function add_results(data) {
    var $container = $('.results-container .results');
    $container.empty();

    $.each(data['data'], function(index, value) {
      var attributes = value['attributes'];
      var matches = $.map(value['meta']['matches'], function(matches, key) {
        matches = matches.join(', ');
        switch(key) {
          case 'd': matches += ' <span>in defendants</span>'; break;
          case 'p': matches += ' <span>in plaintiffs</span>'; break;
          case 'sd':
          case 'sp': matches += ' <span>in solicitors</span>'; break;
          default: matches +=  ' <span>in filings/listings/orders</span>';
        };
        return matches;
      });

      var $row = $(`
        <div class='result row'>
          <div class='col-sm-12'>
            <div class='row'>
              <div class='col-sm-8'>
                <span class='title'><a href='${value['links']['self']}'>${attributes['title']}</a></span>
              </div>

              <div class='col-sm-2'>
                <span class='reference'>${attributes['reference']}</span>
              </div>

              <div class='col-sm-2'>
                <span class='date'>${attributes['issued_on']}</span>
              </div>
            </div>

            <div class='matched row'>
              <div class='col-sm-12'>
                <p>
                  <span>Matched on</span>
                  ${matches.length ? matches.join(' &mdash; ') : '&mdash;'}
                </p>
              </div>
            </div>

            <div class='actors row'>
              <div class='col-sm-5'>
                <span>Defendants:</span>
              </div>

              <div class='col-sm-7'>
                <ul>
                  ${$.map(attributes['defendants'], function(defendant) {
                    return `<li>${defendant.name}</li>`;
                  }).join('')}
                </ul>
              </div>
            </div>

            <div class='actors row'>
              <div class='col-sm-5'>
                <span>Legal Representation (defendants):</span>
              </div>

              <div class='col-sm-7'>
                <ul>
                  ${$.map(attributes['defendants'], function(defendant) {
                    return `<li>${defendant.solicitor}</li>`;
                  }).join('')}
                </ul>
              </div>
            </div>

            <div class='actors row'>
              <div class='col-sm-5'>
                <span>Plaintiffs:</span>
              </div>

              <div class='col-sm-7'>
                <ul>
                  ${$.map(attributes['plaintiffs'], function(plaintiff) {
                    return `<li>${plaintiff.name}</li>`;
                  }).join('')}
                </ul>
              </div>
            </div>

            <div class='actors row'>
              <div class='col-sm-5'>
                <span>Legal Representation (plaintiffs):</span>
              </div>

              <div class='col-sm-7'>
                <ul>
                  ${$.map(attributes['plaintiffs'], function(plaintiff) {
                    return `<li>${plaintiff.solicitor}</li>`;
                  }).join('')}
                </ul>
              </div>
            </div>
          </div>
        </div>
      `);

      $container.append($row);
    });
  };

  function get_details(url) {
    $.ajax({
      type: 'GET',
      url: url,
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
        xhr.setRequestHeader('Accept','application/vnd.api+json');
      },
      error: function(data, _status, xhr) {
        var message;
        if (xhr.status == 401) {
          message = 'Your access token has expired, please login again.';

          $('.results-container').toggleClass('d-none');
          $('.details-container').toggleClass('d-none');
          $('.page').toggleClass('d-none');
        }
        else {
          message = 'Sorry but something has gone wrong.';
        }
        add_error_message(message);
      },
      success: function(data) {
        add_details(data);
      }
    });
  };

  function search(url) {
    var data = {
      q: $('#search').val()
    };

    $.ajax({
      data: data,
      type: 'GET',
      url: url,
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
        xhr.setRequestHeader('Accept','application/vnd.api+json');
      },
      error: function(data, _status, xhr) {
        var message;
        if (xhr.status == 401) {
          message = 'Your access token has expired, please login again.';
          $('.page').toggleClass('d-none');
        }
        else {
          message = 'Sorry but something has gone wrong.';
        }
        add_error_message(message);
      },
      success: function(data) {
        add_meta(data);
        add_results(data);
        add_pagination(data);

        $('.results-container').removeClass('d-none');
        $('.details-container').addClass('d-none');
      }
    });
  };
});
