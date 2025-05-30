<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
   use HasFactory;
    protected $fillable = [
       'title','content','category_id','published_at'
      
    ];
    public function category():BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
    
    public function comments(): HasMany      
    {
        return $this->hasMany(Comment::class);
    }
    
}
