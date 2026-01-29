<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PitchDeck extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'pitch_decks';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'founder_id',
        'title',
        'file_path',
        'file_type',
        'thumbnail_path',
        'status',
        'uploaded_by',
    ];

    /**
     * Get the founder that owns the pitch deck.
     */
    public function founder()
    {
        return $this->belongsTo(Founders::class);
    }

    /**
     * Get the user that uploaded the pitch deck.
     */
    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
    public function downloads()
    {
        return $this->hasMany(PitchDeckDownload::class);
    }
    // public function users()
    // {
    //     return $this->belongsToMany(User::class, 'pitch_deck_downloads', 'pitch_deck_id', 'user_id')
    //                 ->withTimestamps();
    // }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
