# Laravel map status API example

Route:

```php
// routes/api.php
use App\Http\Controllers\Api\PlotMapStatusController;
use Illuminate\Support\Facades\Route;

Route::get('/plots/map-status', PlotMapStatusController::class);
```

Controller:

```php
// app/Http/Controllers/Api/PlotMapStatusController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Plot;
use Illuminate\Http\JsonResponse;

class PlotMapStatusController extends Controller
{
    public function __invoke(): JsonResponse
    {
        return response()->json(
            Plot::query()
                ->select(['plot_no', 'status', 'price', 'sector', 'block', 'road'])
                ->get()
                ->map(fn (Plot $plot) => [
                    'plot_no' => (string) $plot->plot_no,
                    'status' => $plot->status ?: 'unknown',
                    'price' => $plot->price,
                    'sector' => $plot->sector,
                    'block' => $plot->block,
                    'road' => $plot->road,
                ])
        );
    }
}
```

Example response:

```json
[
  {
    "plot_no": "27",
    "status": "available",
    "price": 500000,
    "sector": "A",
    "block": "B",
    "road": "12"
  }
]
```
