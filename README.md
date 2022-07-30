# GraphQLRepo

GraphQL 学習用のリポジトリです。

## GraphQL とは

GraphQL は API 向けに作られたクエリ言語およびランタイムのこと。  
クエリはどの言語でも同じ。

## QraghQL の例

```cmd
curl 'http://showtooth.herokuapp.com/' -H 'Content-Type: application/json' --data '{"query":"{allLifts {name}}"}'
```

レスポンス結果

```html
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta charset="utf-8" />
    <title>Heroku | Application Error</title>
    <style media="screen">
      html,
      body,
      iframe {
        margin: 0;
        padding: 0;
      }
      html,
      body {
        height: 100%;
        overflow: hidden;
      }
      iframe {
        width: 100%;
        height: 100%;
        border: 0;
      }
    </style>
  </head>
  <body>
    <iframe src="//www.herokucdn.com/error-pages/no-such-app.html"></iframe>
  </body>
</html>
```

ミューテーションを利用した場合

```cmd
curl 'http://showtooth.herokuapp.com/' -H 'Content-Type: application/json' --data '{"query":"mutation {setLiftStatus(id: "panorama" status: OPEN) {name status}}"}'
```

レスポンス結果

```html
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta charset="utf-8" />
    <title>Heroku | Application Error</title>
    <style media="screen">
      html,
      body,
      iframe {
        margin: 0;
        padding: 0;
      }
      html,
      body {
        height: 100%;
        overflow: hidden;
      }
      iframe {
        width: 100%;
        height: 100%;
        border: 0;
      }
    </style>
  </head>
  <body>
    <iframe src="//www.herokucdn.com/error-pages/no-such-app.html"></iframe>
  </body>
</html>
```

## Snowtppth API での例

クエリ例

```graphql
query {
  allLifts {
    name
    status
  }
}
```

レスポンス

```json
{
  "data": {
    "allLifts": [
      {
        "name": "Astra Express",
        "status": "OPEN"
      },
      {
        "name": "Jazz Cat",
        "status": "OPEN"
      },
      {
        "name": "Jolly Roger",
        "status": "OPEN"
      },
      {
        "name": "Neptune Rope",
        "status": "OPEN"
      },
      {
        "name": "Panorama",
        "status": "HOLD"
      },
      {
        "name": "Prickly Peak",
        "status": "OPEN"
      },
      {
        "name": "Snowtooth Express",
        "status": "OPEN"
      },
      {
        "name": "Summit",
        "status": "CLOSED"
      },
      {
        "name": "Wally's",
        "status": "HOLD"
      },
      {
        "name": "Western States",
        "status": "CLOSED"
      },
      {
        "name": "Whirlybird",
        "status": "HOLD"
      }
    ]
  }
}
```

複数のクエリをまとめて実行する場合

```query
query liftsAndTrails {
  open: liftCount(status: OPEN)
  chairlifts: allLifts {
    liftName: name
    status
  }
  skiSlopes: allTrails {
    name
    difficulty
  }
}
```

レスポンスの例

```json
{
  "data": {
    "open": 6,
    "chairlifts": [
      {
        "liftName": "Astra Express",
        "status": "OPEN"
      },
      {
        "liftName": "Jazz Cat",
        "status": "OPEN"
      },
      {
        "liftName": "Jolly Roger",
        "status": "OPEN"
      },
      {
        "liftName": "Neptune Rope",
        "status": "OPEN"
      },
      {
        "liftName": "Panorama",
        "status": "HOLD"
      },
      {
        "liftName": "Prickly Peak",
        "status": "OPEN"
      },
      {
        "liftName": "Snowtooth Express",
        "status": "OPEN"
      },
      {
        "liftName": "Summit",
        "status": "CLOSED"
      },
      {
        "liftName": "Wally's",
        "status": "HOLD"
      },
      {
        "liftName": "Western States",
        "status": "CLOSED"
      },
      {
        "liftName": "Whirlybird",
        "status": "HOLD"
      }
    ],
    "skiSlopes": [
      {
        "name": "Blue Bird",
        "difficulty": "intermediate"
      },
      {
        "name": "Blackhawk",
        "difficulty": "intermediate"
      },
      {
        "name": "Duck's Revenge",
        "difficulty": "intermediate"
      },
      {
        "name": "Ice Streak",
        "difficulty": "intermediate"
      },
      {
        "name": "Parachute",
        "difficulty": "intermediate"
      },
      {
        "name": "Goosebumps",
        "difficulty": "advanced"
      },
      {
        "name": "River Run",
        "difficulty": "intermediate"
      },
      {
        "name": "Cape Cod",
        "difficulty": "intermediate"
      },
      {
        "name": "Grandma",
        "difficulty": "expert"
      },
      {
        "name": "Wild Child",
        "difficulty": "advanced"
      },
      {
        "name": "Old Witch",
        "difficulty": "expert"
      },
      {
        "name": "Dance Fight",
        "difficulty": "beginner"
      },
      {
        "name": "Sneaky Pete",
        "difficulty": "beginner"
      },
      {
        "name": "Bear Cave",
        "difficulty": "intermediate"
      },
      {
        "name": "Humpty Dumpty",
        "difficulty": "intermediate"
      },
      {
        "name": "Meatball",
        "difficulty": "beginner"
      },
      {
        "name": "Early Riser",
        "difficulty": "intermediate"
      },
      {
        "name": "Sunset",
        "difficulty": "intermediate"
      },
      {
        "name": "Home Run",
        "difficulty": "beginner"
      },
      {
        "name": "Crosscut",
        "difficulty": "beginner"
      },
      {
        "name": "Ocean Breeze",
        "difficulty": "intermediate"
      },
      {
        "name": "Songstress",
        "difficulty": "expert"
      },
      {
        "name": "Mountain Run",
        "difficulty": "intermediate"
      },
      {
        "name": "Summit Saunter",
        "difficulty": "intermediate"
      },
      {
        "name": "Hemmed Slacks",
        "difficulty": "intermediate"
      },
      {
        "name": "David's Dive",
        "difficulty": "advanced"
      },
      {
        "name": "Quarry Chute",
        "difficulty": "expert"
      },
      {
        "name": "Crooked Chute",
        "difficulty": "expert"
      },
      {
        "name": "Mark's Chute",
        "difficulty": "expert"
      },
      {
        "name": "The Terrible Chute",
        "difficulty": "expert"
      },
      {
        "name": "Magma Chute",
        "difficulty": "expert"
      },
      {
        "name": "Saddleback Chute",
        "difficulty": "expert"
      },
      {
        "name": "Omega Chute",
        "difficulty": "intermediate"
      },
      {
        "name": "Adirondack Chute",
        "difficulty": "expert"
      },
      {
        "name": "Chicken Out Traverse",
        "difficulty": "intermediate"
      },
      {
        "name": "Blue Streak",
        "difficulty": "advanced"
      },
      {
        "name": "Hoya Saxa",
        "difficulty": "advanced"
      },
      {
        "name": "Michigan Ave",
        "difficulty": "intermediate"
      },
      {
        "name": "Parker Downhill",
        "difficulty": "advanced"
      },
      {
        "name": "Wiggle Waggle",
        "difficulty": "beginner"
      },
      {
        "name": "Meow Face",
        "difficulty": "intermediate"
      },
      {
        "name": "Golden Ticket",
        "difficulty": "expert"
      },
      {
        "name": "Summit Bowl",
        "difficulty": "advanced"
      },
      {
        "name": "Hangar Bowl",
        "difficulty": "intermediate"
      },
      {
        "name": "Big Gully",
        "difficulty": "expert"
      },
      {
        "name": "Bigger Gully",
        "difficulty": "expert"
      },
      {
        "name": "Broadway Bowl",
        "difficulty": "intermediate"
      },
      {
        "name": "Fish Bowl",
        "difficulty": "advanced"
      },
      {
        "name": "Way Out",
        "difficulty": "beginner"
      },
      {
        "name": "Buford",
        "difficulty": "beginner"
      },
      {
        "name": "Slippy Stream",
        "difficulty": "beginner"
      },
      {
        "name": "Peacock",
        "difficulty": "beginner"
      },
      {
        "name": "Fun Run",
        "difficulty": "beginner"
      },
      {
        "name": "Sweet Treat",
        "difficulty": "beginner"
      },
      {
        "name": "Stump Alley",
        "difficulty": "intermediate"
      },
      {
        "name": "Centennial",
        "difficulty": "advanced"
      },
      {
        "name": "Biennial",
        "difficulty": "advanced"
      },
      {
        "name": "Millenial",
        "difficulty": "advanced"
      },
      {
        "name": "Searcher",
        "difficulty": "intermediate"
      },
      {
        "name": "White Lightning",
        "difficulty": "advanced"
      },
      {
        "name": "Richard's Return",
        "difficulty": "beginner"
      },
      {
        "name": "Head Chutes Gate A",
        "difficulty": "expert"
      },
      {
        "name": "Head Chutes Gate B",
        "difficulty": "expert"
      },
      {
        "name": "Head Chutes Gate C",
        "difficulty": "expert"
      },
      {
        "name": "Bird Glade",
        "difficulty": "expert"
      },
      {
        "name": "Big Bird",
        "difficulty": "expert"
      },
      {
        "name": "Roller Park",
        "difficulty": "expert"
      },
      {
        "name": "Owl Glade",
        "difficulty": "expert"
      },
      {
        "name": "Whippersnapper Ridge",
        "difficulty": "expert"
      },
      {
        "name": "Drop In",
        "difficulty": "expert"
      },
      {
        "name": "Mosh Pit",
        "difficulty": "advanced"
      }
    ]
  }
}
```

#### 参考文献

1. <a href="https://www.oreilly.co.jp/books/9784873118932/">初めての GraphQL</a>
2. <a href="https://graphqlworkshop.com/">GraphQLWorkShop</a>
3. <a href="https://graphql.org/">GraghQL の公式サイト</a>
4. <a href="https://swapi.dev/">SWAPI.dev</a>
5. [SWAPI](https://graphql.org/swapi-graphql/)
6. [Snowtooth API](http://snowtooth.moonhighway.com)
